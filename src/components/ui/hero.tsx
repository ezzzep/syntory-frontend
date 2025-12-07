"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroAction {
  label: string;
  href: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "destructive"
    | "ghost"
    | "link";
}

interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  gradient?: boolean;
  blur?: boolean;
  title: string;
  subtitle?: string;
  actions?: HeroAction[];
  titleClassName?: string;
  subtitleClassName?: string;
  actionsClassName?: string;
}

const Hero = React.forwardRef<HTMLElement, HeroProps>(
  (
    {
      className,
      gradient = true,
      blur = true,
      title,
      subtitle,
      actions,
      titleClassName,
      subtitleClassName,
      actionsClassName,
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative z-0 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-900",
          className
        )}
        {...props}
      >
        {gradient && (
          <div className="absolute top-0 isolate z-0 flex w-screen flex-1 items-start justify-center">
            {blur && (
              <div className="absolute top-0 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />
            )}

            <div className="absolute inset-auto z-40 h-36 w-md -translate-y-[30%] rounded-full bg-white/60 opacity-80 blur-3xl" />

            <motion.div
              initial={{ width: "8rem" }}
              viewport={{ once: true }}
              transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
              whileInView={{ width: "16rem" }}
              className="absolute top-0 z-30 h-36 -translate-y-[20%] rounded-full bg-white/60 blur-2xl"
            />

            <motion.div
              initial={{ width: "15rem" }}
              viewport={{ once: true }}
              transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
              whileInView={{ width: "30rem" }}
              className="absolute inset-auto z-30 h-0.5 -translate-y-[10%] bg-white/60"
            />

            <motion.div
              initial={{ opacity: 0.5, width: "15rem" }}
              whileInView={{ opacity: 1, width: "30rem" }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
              style={{
                backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
              }}
              className="
                absolute inset-auto right-1/2 
                h-56 w-120 
                bg-gradient-conic 
                from-white/40 via-transparent to-transparent
                [--conic-position:from_70deg_at_center_top]
              "
            >
              <div className="absolute w-full left-0 bg-gray-900 h-40 bottom-0 z-20 mask-[linear-gradient(to_top,white,transparent)]" />
              <div className="absolute w-40 h-full left-0 bg-gray-900 bottom-0 z-20 mask-[linear-gradient(to_right,white,transparent)]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0.5, width: "15rem" }}
              whileInView={{ opacity: 1, width: "30rem" }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
              style={{
                backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
              }}
              className="
                absolute inset-auto left-1/2 
                h-56 w-120 
                bg-gradient-conic 
                from-transparent via-transparent to-white/40 
                [--conic-position:from_290deg_at_center_top]
              "
            >
              {" "}
              <div className="absolute w-40 h-full right-0 bg-gray-900 bottom-0 z-20 mask-[linear-gradient(to_left,white,transparent)]" />
              <div className="absolute w-full right-0 bg-gray-900 h-40 bottom-0 z-20 mask-[linear-gradient(to_top,white,transparent)]" />
            </motion.div>
          </div>
        )}

        <motion.div
          initial={{ y: 100, opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ ease: "easeInOut", delay: 0.2, duration: 0.8 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="relative z-50 container flex justify-center flex-1 flex-col px-5 md:px-10 gap-4"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <h1
              className={cn(
                "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white",
                titleClassName
              )}
            >
              {title}
            </h1>

            {subtitle && (
              <p className={cn("text-xl text-gray-300", subtitleClassName)}>
                {subtitle}
              </p>
            )}

            {actions && actions.length > 0 && (
              <div className={cn("flex gap-4 pt-8", actionsClassName)}>
                {actions.map((action, index) => {
                  const isLogin = action.label.toLowerCase() === "login";

                  return (
                    <Button
                      key={index}
                      variant={action.variant || "default"}
                      className={
                        isLogin
                          ? "bg-gray-900 text-white border border-white hover:bg-gray-900"
                          : "bg-white text-black border border-white hover:bg-gray-200"
                      }
                      asChild
                    >
                      <Link href={action.href}>{action.label}</Link>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </section>
    );
  }
);

Hero.displayName = "Hero";

export { Hero };
