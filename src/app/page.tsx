'use client';

import { useState, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';

import PhoneFrame      from '@/components/PhoneFrame';
import WorldLayer      from '@/components/WorldLayer';
import MagicMeter      from '@/components/MagicMeter';
import { useSynth }    from '@/hooks/useSynth';
import type { MagicLevel } from '@/components/MagicMeter';

// ── Lazy-load screens to keep initial bundle small ──────────────────────────
const LoadingScreen      = dynamic(() => import('@/screens/LoadingScreen'),      { ssr: false });
const WelcomeScreen      = dynamic(() => import('@/screens/WelcomeScreen'),      { ssr: false });
const Level1Balloons     = dynamic(() => import('@/screens/Level1Balloons'),     { ssr: false });
const Level2PawMemory    = dynamic(() => import('@/screens/Level2PawMemory'),    { ssr: false });
const Level3CatRescue    = dynamic(() => import('@/screens/Level3CatRescue'),    { ssr: false });
const Level4Puzzle       = dynamic(() => import('@/screens/Level4Puzzle'),       { ssr: false });
const Level5Gift         = dynamic(() => import('@/screens/Level5Gift'),         { ssr: false });
const FinalMessageScreen = dynamic(() => import('@/screens/FinalMessageScreen'), { ssr: false });
const EndingScreen       = dynamic(() => import('@/screens/EndingScreen'),       { ssr: false });
const LevelSuccessScreen = dynamic(() => import('@/components/LevelSuccessScreen'), { ssr: false });

// ── Scene type ──────────────────────────────────────────────────────────────
type Scene =
  | 'loading'
  | 'welcome'
  | 'level1' | 'success1'
  | 'level2' | 'success2'
  | 'level3' | 'success3'
  | 'level4' | 'success4'
  | 'level5' | 'success5'
  | 'final-message'
  | 'ending';

// Map scene → magic meter level
const SCENE_MAGIC: Record<Scene, MagicLevel> = {
  loading:       0,
  welcome:       0,
  level1:        1,
  success1:      1,
  level2:        2,
  success2:      2,
  level3:        3,
  success3:      3,
  level4:        4,
  success4:      4,
  level5:        5,
  success5:      5,
  'final-message': 5,
  ending:        5,
};

// Show the magic meter on these scenes
const SHOW_METER_ON: Scene[] = [
  'level1', 'success1',
  'level2', 'success2',
  'level3', 'success3',
  'level4', 'success4',
  'level5', 'success5',
  'final-message',
  'ending',
];

// Map scene to Level header details
const SCENE_LEVEL_INFO: Record<Scene, { num: number; title: string } | null> = {
  loading: null,
  welcome: null,
  level1: { num: 1, title: 'Balloons' },
  success1: { num: 1, title: 'Balloons' },
  level2: { num: 2, title: 'Paw Memory' },
  success2: { num: 2, title: 'Paw Memory' },
  level3: { num: 3, title: 'Cat Rescue' },
  success3: { num: 3, title: 'Cat Rescue' },
  level4: { num: 4, title: 'Word Puzzle' },
  success4: { num: 4, title: 'Word Puzzle' },
  level5: { num: 5, title: 'Open Gift' },
  success5: { num: 5, title: 'Open Gift' },
  'final-message': null,
  ending: null,
};

// Success screen configs
const SUCCESS_CONFIG: Partial<Record<Scene, { message: string; emoji: string; next: Scene }>> = {
  success1: {
    message: 'All balloons popped! The magic is awakening ✨',
    emoji:   '🎈',
    next:    'level2',
  },
  success2: {
    message: 'Paws found! Your memory is paws-itively amazing 🐾',
    emoji:   '🐾',
    next:    'level3',
  },
  success3: {
    message: 'All cats rescued! You\'re a hero, Shadow! 🐱',
    emoji:   '🐱',
    next:    'level4',
  },
  success4: {
    message: 'Message assembled! Your name shines bright ⭐',
    emoji:   '🎀',
    next:    'level5',
  },
  success5: {
    message: 'Gift unwrapped! Your surprise is ready 🎁',
    emoji:   '🎁',
    next:    'final-message',
  },
};

// Level hints shown in the top HUD's hint button
const LEVEL_HINTS: Partial<Record<Scene, string>> = {
  level1: "Tap and pop all the colorful balloons floating up before they escape! 🎈",
  level2: "Watch the glowing paws carefully, then tap the correct cards from memory! 🐾",
  level3: "Find and tap all the cute kittens hidden around the screen to rescue them! 🐱",
  level4: "Drag and reorder the word tiles to assemble the birthday message in the correct order! 🧩",
  level5: "Unwrap the birthday gift! Shake the box, untie the ribbon, and tap to open your surprise! 🎁",
};

// ── Page transition variants ─────────────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, scale: 0.97, y: 20 },
  animate: { opacity: 1, scale: 1,    y: 0,  transition: { type: 'spring' as const, stiffness: 220, damping: 26 } },
  exit:    { opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.2 } },
};

// ── Fallback shimmer ─────────────────────────────────────────────────────────
function ScreenFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className="text-5xl"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        ✨
      </motion.div>
    </div>
  );
}

// ── Main orchestrator ────────────────────────────────────────────────────────
export default function Home() {
  const [scene, setScene] = useState<Scene>('loading');
  const { playSfx, startMusic, toggleMute, setBgmTheme, muted } = useSynth();
  const [hudProgress, setHudProgress] = useState<{ current: number; target?: number; suffix?: string }>({ current: 0 });

  const go = useCallback((next: Scene) => {
    setScene(next);
    setHudProgress({ current: 0 });
    if (next === 'final-message' || next === 'ending') {
      setBgmTheme('birthday');
    } else if (next === 'welcome' || next === 'loading') {
      setBgmTheme('pentatonic');
    }
  }, [setBgmTheme]);

  const handleWelcomeStart = useCallback(() => {
    setBgmTheme('pentatonic');
    startMusic();
    playSfx('tap');
    go('level1');
  }, [startMusic, playSfx, go, setBgmTheme]);

  const handleProgress = useCallback((current: number, target?: number, suffix?: string) => {
    setHudProgress({ current, target, suffix });
  }, []);

  const magicLevel = SCENE_MAGIC[scene];
  const showMeter  = SHOW_METER_ON.includes(scene);
  const successCfg = SUCCESS_CONFIG[scene];
  const levelInfo  = SCENE_LEVEL_INFO[scene];

  return (
    <PhoneFrame>
      {/* Animated world background — always present */}
      <WorldLayer magicLevel={magicLevel} />

      {/* Unified HUD Top Bar */}
      <AnimatePresence>
        {showMeter && (
          <motion.div
            key="hud-bar"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24 }}
            className="absolute top-0 left-0 right-0 z-50"
          >
            <MagicMeter
              magicLevel={magicLevel}
              levelNum={levelInfo?.num}
              levelTitle={levelInfo?.title}
              currentScore={hudProgress.current}
              targetScore={hudProgress.target}
              scoreSuffix={hudProgress.suffix}
              muted={muted}
              onToggleMute={toggleMute}
              hintText={LEVEL_HINTS[scene]}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          className="absolute inset-0"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Suspense fallback={<ScreenFallback />}>

            {scene === 'loading' && (
              <LoadingScreen onComplete={() => go('welcome')} />
            )}

            {scene === 'welcome' && (
              <WelcomeScreen onStart={handleWelcomeStart} />
            )}

            {/* ── Level 1 ── */}
            {scene === 'level1' && (
              <Level1Balloons onComplete={() => go('success1')} onProgress={handleProgress} />
            )}
            {scene === 'success1' && successCfg && (
              <LevelSuccessScreen
                message={successCfg.message}
                emoji={successCfg.emoji}
                onContinue={() => { playSfx('tap'); go(successCfg.next); }}
              />
            )}

            {/* ── Level 2 ── */}
            {scene === 'level2' && (
              <Level2PawMemory onComplete={() => go('success2')} onProgress={handleProgress} />
            )}
            {scene === 'success2' && successCfg && (
              <LevelSuccessScreen
                message={successCfg.message}
                emoji={successCfg.emoji}
                onContinue={() => { playSfx('tap'); go(successCfg.next); }}
              />
            )}

            {/* ── Level 3 ── */}
            {scene === 'level3' && (
              <Level3CatRescue onComplete={() => go('success3')} onProgress={handleProgress} />
            )}
            {scene === 'success3' && successCfg && (
              <LevelSuccessScreen
                message={successCfg.message}
                emoji={successCfg.emoji}
                onContinue={() => { playSfx('tap'); go(successCfg.next); }}
              />
            )}

            {/* ── Level 4 ── */}
            {scene === 'level4' && (
              <Level4Puzzle onComplete={() => go('success4')} onProgress={handleProgress} />
            )}
            {scene === 'success4' && successCfg && (
              <LevelSuccessScreen
                message={successCfg.message}
                emoji={successCfg.emoji}
                onContinue={() => { playSfx('tap'); go(successCfg.next); }}
              />
            )}

            {/* ── Level 5 ── */}
            {scene === 'level5' && (
              <Level5Gift onComplete={() => go('success5')} onProgress={handleProgress} />
            )}
            {scene === 'success5' && successCfg && (
              <LevelSuccessScreen
                message={successCfg.message}
                emoji={successCfg.emoji}
                onContinue={() => { playSfx('tap'); go(successCfg.next); }}
              />
            )}

            {/* ── Final message + ending ── */}
            {scene === 'final-message' && (
              <FinalMessageScreen onComplete={() => { playSfx('sparkle'); go('ending'); }} />
            )}

            {scene === 'ending' && (
              <EndingScreen onRestart={() => go('loading')} />
            )}

          </Suspense>
        </motion.div>
      </AnimatePresence>
    </PhoneFrame>
  );
}
