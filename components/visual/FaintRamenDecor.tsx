// 紙面ページ（/postなど）の背景に薄く敷く湯気と麺線。
// 動かさない静的な線画で、文字の可読性を邪魔しない濃さに抑える。
export default function FaintRamenDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 select-none overflow-hidden">
      <svg
        viewBox="0 0 120 230"
        fill="none"
        className="absolute -top-4 right-[4%] w-20 text-border sm:w-24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M32 224 C10 184 52 150 32 108 C14 70 46 38 34 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M66 218 C48 182 84 148 66 110 C50 74 80 44 70 14" stroke="currentColor" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
        <path d="M98 210 C84 180 112 152 98 118 C86 88 108 62 100 34" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <svg
        viewBox="0 0 380 150"
        fill="none"
        className="absolute -left-16 bottom-6 w-[300px] text-border"
        xmlns="http://www.w3.org/2000/svg"
      >
        {[0, 30, 60, 90].map((dy, i) => (
          <path
            key={dy}
            d={`M0 ${24 + dy} C 60 ${4 + dy} 120 ${44 + dy} 190 ${24 + dy} S 320 ${4 + dy} 380 ${24 + dy}`}
            stroke="currentColor"
            strokeOpacity={0.8 - i * 0.15}
            strokeWidth="2"
          />
        ))}
      </svg>
    </div>
  );
}
