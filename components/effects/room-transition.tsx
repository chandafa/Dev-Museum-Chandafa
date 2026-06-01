"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export function RoomTransition() {
  const [room, setRoom] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const lastRoom = useRef<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".museum-room[data-room]"));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const nextRoom = active?.target.getAttribute("data-room");
        if (!nextRoom || nextRoom === lastRoom.current) return;

        lastRoom.current = nextRoom;
        setRoom(nextRoom);
        setVisible(true);

        if (timer.current) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setVisible(false), 920);
      },
      { threshold: [0.35, 0.5, 0.68], rootMargin: "-12% 0px -18% 0px" }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && room ? (
        <motion.div
          key={room}
          className="pointer-events-none fixed inset-0 z-[75] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-0 bg-museum-ink/45 backdrop-blur-[2px]"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            exit={{ clipPath: "inset(0 0 0 100%)" }}
            transition={{ duration: 0.62, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
            initial={{ y: 30, opacity: 0, filter: "blur(10px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -18, opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[0.6rem] uppercase tracking-[0.48em] text-museum-acid">Entering room</p>
            <h2 className="mt-3 text-[clamp(2.4rem,9vw,7rem)] font-semibold leading-none tracking-[-0.1em] text-museum-paper">{room}</h2>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
