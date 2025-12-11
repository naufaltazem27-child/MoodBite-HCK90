import { createBrowserRouter, redirect } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import HomePage from "./pages/homePage";
import RecommendationPage from "./pages/RecommendationPage";
import RegisterPage from "./pages/registerPage";

// Guard: Cek Login
const authGuard = () => {
  if (!localStorage.getItem("access_token")) {
    return redirect("/login");
  }
  return null;
};

// Guard: Cek Sudah Login (Biar gak bisa buka halaman login lagi)
const loginGuard = () => {
  if (localStorage.getItem("access_token")) {
    return redirect("/");
  }
  return null;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    loader: loginGuard,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    loader: loginGuard,
  },
  {
    path: "/",
    element: <HomePage />,
    loader: authGuard,
  },
  {
    path: "/recommendation",
    element: <RecommendationPage />,
    loader: authGuard,
  },
]);

export default router;
