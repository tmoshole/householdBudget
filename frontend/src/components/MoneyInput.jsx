import { Input } from "@/components/ui/input";

export const MoneyInput = ({
  value,
  onChange,
  symbol = "R",
  testId,
  placeholder = "0.00",
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono-nums">
        {symbol}
      </span>
      <Input
        type="text"
        inputMode="decimal"
        data-testid={testId}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8 font-mono-nums text-right bg-background border-border focus-visible:ring-2 focus-visible:ring-primary"
      />
    </div>
  );
};
