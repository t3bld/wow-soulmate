export function Emphasize({ text }: { text: string }) {
  const parts = text.split(/\*([^*]+)\*/g);

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <em key={i} className="not-italic font-semibold text-soul-300">
            {part}
          </em>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
