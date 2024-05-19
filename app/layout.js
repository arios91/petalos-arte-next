import 'bootstrap/dist/css/bootstrap.css';
import "./globals.css";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from './components/Footer';
import { ContextProvider } from "@/context/MyContext";
import BootstrapJs from './components/BootstrapJs';

export const metadata = {
  title: 'Petalos Y Arte',
  description: 'Local Flower Shop Serving South Texas',
  keywords: 'flower shop, flowers, delivery'
};

export default function RootLayout({ children }) {
  return (
    <ContextProvider>
      <html lang="en" className='App container'>
        <body>
          <Header/>
          <Navbar/>
          {children}
          <Footer/>
          <BootstrapJs/>
        </body>
      </html>
    </ContextProvider>
  );
}
