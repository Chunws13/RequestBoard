import axios from "axios";
import { Container, Row, Col, Form, Table, Button, Dropdown } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import MediaRequest from "./MediaRequest";
import '../css/BoardStyle.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';

const MediaBoard = () => {
    const ConvertDate = ({ datetime }) => {
        const year = datetime.getFullYear();
        let month = datetime.getMonth() + 1;
        let day = datetime.getDate();
        
        month = month.toString().length === 1 ? `0${month}` : month
        day = day.toString().length === 1 ? `0${day}` : day

        return `${year}.${month}.${day}`
    }
    const [deadLine, setDeadLine] = useState(ConvertDate({datetime : new Date()}));
    const [belong, setBelong] = useState();
    const [requester, setRequester] = useState("");
    const [customer, setCustomer] = useState("");
    const [stack, setStack] = useState();
    const [reference, setReference] = useState("");
    const [detail, setDetail] = useState("");
    const [notice, setNotice] = useState("")

    const [requestList, setRequestList] = useState([]);

    const ChangeNotice = (event) => {
        setNotice(event.target.text);
    };

    const ChangeBelong = (eventKey, event) => {
        setBelong(event.target.text);
    };

    const ChangeRequester = (event) => {
        setRequester(event.target.value);
    };

    const ChangeCustomer = (event) => {
        setCustomer(event.target.value);
    };

    const ChangeStack = (eventKey, event) => {
        setStack(event.target.text);
    };

    const ChangeReference = (event) => {
        setReference(event.target.value);
    };

    const ChangeDetail = (event) => {
        setDetail(event.target.value);
    };

    const RequestAllList = async() => {
        try{
            const list = await axios.get("http://127.0.0.1:8000/api/tech/",
                            {
                                headers:{ 
                                    "Content-Type": "application/json"
                            }});
            
            setRequestList(list.data.data);

        } catch {
            alert("에러");
        }

    };
    const RequestRegist = async(event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/tech/",
                            {
                                dead_line: deadLine, requester, belong,
                                customer, stack, reference, detail
                            },
                            {
                                headers:{ 
                                    "Content-Type": "application/json"
                            }})

            setRequestList([response.data, ...requestList])

            setDeadLine(ConvertDate({datetime: new Date()}));
            setBelong("선택");
            setRequester("");
            setCustomer("");
            setStack("선택");
            setReference("");
            setDetail("");
            
        } catch {
            alert("에러");
        }
        
    };
    const UpdateRequest = (updateData) => {
        setRequestList(( prevRequest ) => {
            return prevRequest.map((requestList) => {
                if (requestList._id.$oid === updateData._id.$oid){
                    return updateData
                }
                return requestList
            })
        })

    }
    useEffect(() => {
        RequestAllList();
    }, []);

    return (
        <Container fluid style={{height: "100%", width: "100%"}} >
            <Row style={{display: "flex", height: "10vh", backgroundColor: "green", 
                        alignItems: "center", justifyContent: "center", fontSize: "5vh"}}>
                Marketing Media 요청 게시판
            </Row>

            <Row style={{display: "flex", justifyContent: "center", alignItems: "center", height: "10vh"}}>
                <Form>
                    <Form.Group as={Row} >
                        <Form.Label column sm="2"> 공지사항 </Form.Label>
                        <Col sm="10">
                            <Form.Control type="text" value={notice} onChange={ChangeNotice}/>
                        </Col>
                    </Form.Group>
                </Form>
            </Row>

            <Row style={{height: "100%", alignItems: "center", backgroundColor: "green"}}>
                <Form onSubmit={RequestRegist} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <Table variant="dark">
                        <thead>
                            <tr>
                                <th style={{ width: "7%" }}> 마감일 </th>
                                <th style={{ width: "10%" }}> 소속 </th>
                                <th style={{ width: "5%" }}> 요청자 </th>
                                <th style={{ width: "5%" }}> 고객사 </th>
                                <th style={{ width: "10%" }}> 관련 기술 </th>
                                <th style={{ width: "10%" }}> URL / APP </th>
                                <th style={{ width: "20%" }}> 상세 </th>
                                <th style={{ width: "5%" }}>  </th>
                            </tr>
                        </thead>
                        <tbody >
                            <tr>
                                <td>
                                    <DatePicker
                                        selected={deadLine} 
                                        onChange={(date) => setDeadLine(ConvertDate({datetime: date}))}
                                        dateFormat="yyyy. MM. dd"
                                        customInput= {<Form.Control type="text" style={{textAlign: "center"}}/>}
                                    />
                                
                                </td>
                                <td> 
                                    <Dropdown onSelect={ChangeBelong}> 
                                        <Dropdown.Toggle as={Button} variant="light" style={{width: "100%", color: "black"}}>
                                            {belong ? belong : "선택" }
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu style={{fontSize: "1.5vh"}}>
                                            <Dropdown.Item>마케팅 1국</Dropdown.Item>
                                            <Dropdown.Item>마케팅 2국</Dropdown.Item>
                                            <Dropdown.Item>마케팅 3국</Dropdown.Item>
                                            <Dropdown.Item>마케팅 4국</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown> 
                                </td>
                                <td> <Form.Control type="text" value={requester} onChange={ChangeRequester} style={{textAlign: "center"}}/> </td>
                                <td> <Form.Control type="text" value={customer} onChange={ChangeCustomer} style={{textAlign: "center"}}/> </td>
                                <td> 
                                    <Dropdown onSelect={ChangeStack}>  
                                        <Dropdown.Toggle as={Button} variant="light" style={{width: "100%", color: "black"}}>
                                            {stack ? stack : "선택"}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu style={{fontSize: "1.5vh", textAlign: "center"}}>
                                            <Dropdown.Item>GTM</Dropdown.Item>
                                            <Dropdown.Item>GA4</Dropdown.Item>
                                            <Dropdown.Item>Looker Studio</Dropdown.Item>
                                            <Dropdown.Divider />
                                            
                                            <Dropdown.Item>Facebook / Instagram</Dropdown.Item>
                                            <Dropdown.Item>Google</Dropdown.Item>
                                            <Dropdown.Item>Kakako</Dropdown.Item>
                                            <Dropdown.Item>Naver</Dropdown.Item>
                                            <Dropdown.Divider />

                                            <Dropdown.Item>AB180</Dropdown.Item>
                                            <Dropdown.Item>AppsFlyer</Dropdown.Item>
                                            <Dropdown.Item>Adbrix</Dropdown.Item>
                                            <Dropdown.Divider />

                                            <Dropdown.Item>Tableau</Dropdown.Item>
                                            <Dropdown.Divider />

                                            <Dropdown.Item>기타</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown> 
                                </td>
                                <td> <Form.Control type="text" value={reference} onChange={ChangeReference} style={{textAlign: "center"}}/> </td>
                                <td> <Form.Control type="text" value={detail} onChange={ChangeDetail} style={{textAlign: "center"}}/> </td>
                                <td> <Button type="submit" variant="light" style={{ width: "100%"}}> 요청 </Button> </td>
                            </tr>
                        </tbody>
                    </Table>
                    
                </Form>
            </Row>
            <Row style={{display: "flex", justifyContent: "center", height: "65vh", overflow: "auto"}}>
                <Table>
                    <thead>
                        <th style={{ width: "7%" }}> 요청일 </th>
                        <th style={{ width: "7%" }}> 마감일 </th>
                        <th style={{ width: "10%" }}> 소속 </th>
                        <th style={{ width: "5%" }}> 요청자 </th>
                        <th style={{ width: "5%" }}> 고객사 </th>
                        <th style={{ width: "10%" }}> 관련 기술 </th>
                        <th style={{ width: "10%" }}> URL / APP </th>
                        <th style={{ width: "20%" }}> 상세 </th>
                        <th style={{ width: "5%" }}> 현황 </th>
                    </thead>
                    <tbody style={{verticalAlign: "middle"}}>
                        { requestList.map((item, index) => {
                            const start_date = ConvertDate({datetime: new Date(item.request_date.$date)})
                            const end_date = ConvertDate({datetime: new Date(item.dead_line.$date)})
                            return (
                                <MediaRequest
                                    key={index}
                                    id={item._id.$oid}
                                    start_date={start_date}
                                    end_date={end_date} 
                                    belong={item.belong}
                                    requester={item.requester}
                                    customer={item.customer}
                                    stack={item.stack}
                                    reference={item.reference}
                                    detail={item.detail}
                                    status={item.status}
                                    UpdateRequest={UpdateRequest}
                                    />
                            )
                        }) }
                    </tbody>
                </Table>
            </Row>
        </Container>
    );

};

export default MediaBoard;