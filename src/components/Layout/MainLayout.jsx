import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <div>
      <Navbar/>
      <main>
        <Outlet /> 
      </main>
      <footer>
        <p>Main Footer</p>
      </footer>
    </div>
  );
};

export default MainLayout;
