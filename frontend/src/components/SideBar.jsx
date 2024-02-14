import { Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const SideBar = () => {
    return (
        <Container fluid style={{width: "15vw", height: "100vh", backgroundColor: "#5986ED", color: "white"}}>
            <Row style={{display: "flex", alignItems: "center", height: "25%" }}>
                <Link to ="/"style={{textDecoration : 'none', color: "inherit"}}>
                    블루오렌지 커뮤니케이션즈
                </Link>
            </Row>
            <Row style={{display: "flex", alignItems: "center", height: "25%" }}>
                <Link to ="/tech" style={{textDecoration : 'none', color: "inherit"}}>
                    Marketing Tech
                </Link>
            </Row>
            <Row style={{display: "flex", alignItems: "center", height: "25%" }}>
                <Link to ="/media" style={{textDecoration : 'none', color: "inherit"}}>
                    Marketing Media
                </Link>
            </Row>
            <Row style={{display: "flex", alignItems: "center", height: "25%" }}>
                <Link to ="/" style={{textDecoration : 'none', color: "inherit"}}>
                    Creative
                </Link>
            </Row>
        </Container>
    );
};

export default SideBar;