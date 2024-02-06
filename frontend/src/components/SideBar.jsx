import { Container, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const SideBar = () => {
    return (
        <Container fluid style={{width: "15vw", height: "100vh", backgroundColor: "black", color: "white"}}>
            <Row style={{display: "flex", alignItems: "middle" }}>
                블루오렌지 커뮤니케이션즈
            </Row>
            <Row>
                Marketing Tech 문의 게시판
            </Row>
            <Row>
                Marketing Media 문의 게시판
            </Row>
            <Row>
                Creative 요청 게시판
            </Row>
        </Container>
    );
};

export default SideBar;
// /