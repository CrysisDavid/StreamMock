import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import MyList from "@/pages/MyList";
import CreateMovie from "@/pages/CreateMovie";
import CreatedList from "@/pages/CreatedList";
import RecentList from "./pages/RecentList";
import PopularList from "./pages/PopularList";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/recent" component={RecentList} />
      <Route path="/popular" component={PopularList} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/my-list" component={MyList} />
      <Route path="/create-movie" component={CreateMovie} />
      <Route path="/edit-movie/:id" component={CreateMovie} />
      <Route path="/created-list" component={CreatedList} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
