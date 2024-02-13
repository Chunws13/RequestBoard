import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import TechBoard from './Tech/TechBoard';
import MediaBoard from './Media/MediaBaord';
import Main from './Main';
import SideBar from './SideBar';
import 'bootstrap/dist/css/bootstrap.min.css';

const Router = () => {
    return (
        <BrowserRouter>
            <Container fluid style={{display: "flex", padding: 0}}>
                <SideBar/>
                <Routes>
                    <Route path="/" element={ <Main/>} />
                    <Route path="/tech" element={ <TechBoard/>} />
                    <Route path="/media" element={ <MediaBoard/>} />
                </Routes>
                    
            </Container>
        </BrowserRouter>
    )
};

export default Router;