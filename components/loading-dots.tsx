export function LoadingDots() {
  return (
    <div className="flex w-full lg:w-1/2 p-2 justify-start">
      <div className="flex items-center space-x-2 text-muted-foreground">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
          <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
        </div>
      </div>
    </div>
  );
} 