 
import { FontProvider } from "./providers/font-provider/font-provider";
import { SearchProvider } from "./providers/search-provider/search-provider";
import { ThemeProvider } from "./providers/theme-provider/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

 
export function UIProviders({ children }: { children: React.ReactNode }) {


  return (

    <FontProvider>
      <ThemeProvider defaultTheme ={"dark"}>
        <TooltipProvider delayDuration={0}>
          <Toaster />
          <SearchProvider>
            {children}
          </SearchProvider>
        </TooltipProvider>
      </ThemeProvider>
    </FontProvider>


  );
}
