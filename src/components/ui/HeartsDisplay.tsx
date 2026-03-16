interface Props { hearts: number; max?: number; }
export function HeartsDisplay({ hearts, max = 5 }: Props) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className="text-2xl">{i < hearts ? '❤️' : '🖤'}</span>
      ))}
    </div>
  );
}
