import AppRouter from "@/routes/AppRouter";
import { Toaster } from "@/components/ui/toaster";

const App = () => (
  <>
    <AppRouter />
    <Toaster />
  </>
);

export default App;
