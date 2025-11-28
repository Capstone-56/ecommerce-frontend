import { Fade, Slide, Typography } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";

const HEADING = "Exclusive Quality\nfor Better Living";

const sleep = async (ms: number): Promise<void> => {
  return new Promise((resolve): void => {
    setTimeout((): void => {
      resolve();
    }, ms);
  });
};

const Header = (): ReactNode => {
  const [heading, setHeading] = useState(new Array<String>());
  const [typing, setTyping] = useState(true);
  const [showCaret, setShowCaret] = useState(true);
  const startedRef = useRef(false);

  const typeHeading = async (): Promise<void> => {
    if (startedRef.current) {
      return;
    }

    const timer = setInterval((): void => {
      setShowCaret((show) => !show);
    }, 1000);

    startedRef.current = true;

    await sleep(500 + Math.random() * 200);

    for (let i = 0; i < HEADING.length; ++i) {
      setHeading([...HEADING.substring(0, i + 1)]);
      await sleep(100 + Math.random() * 200);
    }

    await sleep(1000);
    clearInterval(timer);
    setTyping(false);
  };

  useEffect((): void => {
    typeHeading();
  }, []);

  return (
    <Typography
      variant="h1"
      component="h1"
      sx={{
        fontSize: { xs: "48px", md: "72px", lg: "80px" },
        mb: 1,
        color: "white",
        whiteSpace: "pre-line",
        fontWeight: "bold",
        textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
      }}
    >
      {heading.map((char, i): ReactNode => {
        return (
          <Fade in timeout={600}>
            {char === "\n" ? (
              <br
                style={(i === (heading.length - 1) ? {
                  borderRight: "2px",
                  borderRightColor: (typing && showCaret ? "white" : "transparent"),
                  borderRightStyle: "solid"
                } : undefined)}
              />
            ) : (
              <span
                style={(i === (heading.length - 1) ? {
                  borderRight: "2px",
                  borderRightColor: (typing && showCaret ? "white" : "transparent"),
                  borderRightStyle: "solid"
                } : undefined)}
              >
                {char}
              </span>
            )}
          </Fade>
        );
      })}
    </Typography>
  );
};

export default Header;
