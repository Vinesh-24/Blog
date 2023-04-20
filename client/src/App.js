import './App.css'
import {Route, Routes} from 'react-router-dom';
import Layout from './Layout';
import IndexPage from './Pages/IndexPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import CreatePost from './Pages/CreatePost';
import EditPost from './Pages/EditPost';
import { UserContextProvider } from './UserContext';
import PostPage from './Pages/PostPage';
import YourPost from './Pages/YourPost';

function App() {
  return (
  <UserContextProvider>
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element = {<IndexPage/>}/>
        <Route path="/login" element = {<LoginPage/>}/>
        <Route path="/register" element = {<RegisterPage/>}/>
        <Route path="/yourpost" element = {<YourPost/>}/>
        <Route path="/create" element = {<CreatePost/>}/>
        <Route path="/post/:id" element = {<PostPage/>}/>  
        <Route path="/edit/:id" element = {<EditPost/>}/>      
      </Route>
    </Routes>
    </UserContextProvider>
  );
}

export default App;
 