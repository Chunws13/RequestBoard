import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import TechBoard from './TechBaord';
import SideBar from './SideBar';
import 'bootstrap/dist/css/bootstrap.min.css';

const Router = () => {
    return (
        <BrowserRouter>
            <Container fluid style={{display: "flex", padding: 0}}>
                <SideBar/>
                <Routes>
                    <Route path="/" element={ <TechBoard/>} />
                </Routes>
                    
            </Container>
        </BrowserRouter>
    )
};

export default Router;