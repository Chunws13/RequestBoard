import axios from "axios";
import { Container, Row, Col, Form, Table, Button, Dropdown } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import MediaRequest from "./MediaRequest";
import { ConvertDate } from "../utils/ConvertDate";
import '../css/BoardStyle.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';

const MediaBoard = () => {
    
    const [deadLine, setDeadLine] = useState(ConvertDate({datetime : new Date()}));
    const [belong, setBelong] = useState("선택");
    const [requester, setRequester] = useState("");
    const [customer, setCustomer] = useState("");
    const [category, setcategory] = useState();
    const [range, setrange] = useState("");
    const [detail, setDetail] = useState("");
    const [notice, setNotice] = useState("");
    const [file, setFile] = useState(null);

    const [requestList, setRequestList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);

    const belongList = ["마케팅 1국", "마케팅 2국", "마케팅 3국", "마케팅 4국"];
    const [belongFilter, setBelongFilter] = useState("전체");

    const statusList = ["전체", "접수", "처리중", "보류", "완료"];
    const [statusFilter, setStatusFilter] = useState("전체");

    const [monthList, setMonthList] = useState(["전체"]);
    const [monthFilter, setMonthFilter] = useState("전체");

    const ChangeNotice = (event) => {
        setNotice(event.target.text);
    };

    const RequestAllList = async() => {
        try{
            const list = await axios.get("http://127.0.0.1:8000/api/media/",
                            {
                                headers:{ 
                                    "Content-Type": "application/json"
                            }});
            
            setRequestList(list.data.data);
            setFilteredList(list.data.data);

        } catch {
            alert("에러");
        }

    };

    const RequestRegist = async(event) => {
        event.preventDefault();
        const postData = {
            dead_line: deadLine, 
            requester: requester, 
            belong: belong,
            customer: customer, 
            category: category, 
            range: range, 
            detail: detail
        }

        const newPostData = new FormData();
        for (let [key, value] of Object.entries(postData)){
            newPostData.append(key, value);
        }

        if (file !== null){
            newPostData.append("file", file)
        }
        
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/media/",
                            newPostData
                            ,
                            {
                                headers:{ 
                                    "Content-Type": "multipart/form-data"
                            }})
            
            setRequestList([response.data, ...requestList]);
            setRequestList([response.data, ...filteredList]);

            setDeadLine(ConvertDate({datetime: new Date()}));
            setBelong("선택");
            setRequester("");
            setCustomer("");
            setcategory("선택");
            setrange("");
            setDetail("");
            
        } catch (error) {
            alert(error);
        }
        
    };
    const UpdateRequest = (updateData) => {
        setFilteredList(( prevRequest ) => {
            return prevRequest.map((requestList) => {
                if (requestList._id.$oid === updateData._id.$oid){
                    return updateData
                }

                return requestList;
            });
        });
    };

    const Filter = ({belongF = belongFilter, statusF = statusFilter, monthF = monthFilter}) => {
        setStatusFilter(statusF);
        setBelongFilter(belongF);
        setMonthFilter(monthFilter);
        const regex = new RegExp(monthF)

        const filteredData = requestList.filter((item) => {
            const dataList = []
            if (belongF !== "전체"){
                dataList.push(item.belong === belongF);
            };

            if (statusF !== "전체"){
                dataList.push(item.status === statusF);
            };

            if (monthF !== "전체"){
                dataList.push(regex.test(item.request_date.$date));
            }
            
            return dataList.length === 0 || dataList.every(data => data);
        });

        setFilteredList(filteredData);
    };

    const RecentMonth = () => {
        const recentMonth = [];

        const standardMonth = new Date();
        for (let i = 0; i < 12; i ++){
            
            const year = standardMonth.getFullYear();
            
            let month = standardMonth.getMonth() + 1;
            month = month.toString().length === 1 ? `0${month}` : month
    
            const formatDate = `${year}.${month}`;
            recentMonth.push(formatDate);
    
            standardMonth.setMonth(standardMonth.getMonth() -1);
        };

        setMonthList(recentMonth);
    };

    useEffect(() => {
        RequestAllList();
        RecentMonth();
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
                                <th style={{ width: "10%" }}> 카테고리 </th>
                                <th style={{ width: "10%" }}> 범주 </th>
                                <th style={{ width: "20%" }}> 상세 </th>
                                <th style={{ width: "10%" }}> 첨부파일 </th>
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
                                    <Dropdown onSelect={(eventKey) => setBelong(eventKey)}> 
                                        <Dropdown.Toggle as={Button} variant="light" style={{width: "100%", color: "black"}}>
                                            {belong ? belong : "선택" }
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu style={{fontSize: "1.5vh", textAlign: "center"}}>
                                            
                                            { belongList.map((item, index) => {
                                                return (
                                                    <Dropdown.Item key={index} eventKey={item}> {item} </Dropdown.Item>
                                                );
                                            })};

                                        </Dropdown.Menu>
                                    </Dropdown> 
                                </td>
                                <td> <Form.Control type="text" value={requester} 
                                        onChange={(event) => setRequester(event.target.value)} style={{textAlign: "center"}}/> </td>

                                <td> <Form.Control type="text" value={customer} 
                                        onChange={(event) => setCustomer(event.target.value)} style={{textAlign: "center"}}/> </td>

                                <td> 
                                    <Dropdown onSelect={(eventKey) => setcategory(eventKey)}>  
                                        <Dropdown.Toggle as={Button} variant="light" style={{width: "100%", color: "black"}}>
                                            {category ? category : "선택"}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu style={{fontSize: "1.5vh", textAlign: "center"}}>
                                            <Dropdown.Item eventKey="GTM">GTM</Dropdown.Item>
                                            <Dropdown.Item eventKey="GA4">GA4</Dropdown.Item>
                                            <Dropdown.Item eventKey="Looker Studio">Looker Studio</Dropdown.Item>
                                            <Dropdown.Divider />
                                            
                                            <Dropdown.Item eventKey="FaceBook / Instagram">Facebook / Instagram</Dropdown.Item>
                                            <Dropdown.Item eventKey="Google">Google</Dropdown.Item>
                                            <Dropdown.Item eventKey="Kakao">Kakako</Dropdown.Item>
                                            <Dropdown.Item eventKey="Naver">Naver</Dropdown.Item>
                                            <Dropdown.Divider />

                                            <Dropdown.Item eventKey="AB180" >AB180</Dropdown.Item>
                                            <Dropdown.Item eventKey="AppsFlyer">AppsFlyer</Dropdown.Item>
                                            <Dropdown.Item eventKey="Adbrix">Adbrix</Dropdown.Item>
                                            <Dropdown.Divider />

                                            <Dropdown.Item eventKey="Tableau">Tableau</Dropdown.Item>
                                            <Dropdown.Divider />

                                            <Dropdown.Item>기타</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown> 
                                </td>
                                <td> <Form.Control type="text" value={range} 
                                        onChange={(event) => setrange(event.target.value)} style={{textAlign: "center"}}/> </td>

                                <td> <Form.Control type="text" value={detail} 
                                        onChange={(event) => setDetail(event.target.value)} style={{textAlign: "center"}}/> </td>
                                
                                <td> <Form.Control onChange={(event) => setFile(event.target.files[0])} type="file"/> </td>

                                <td> <Button type="submit" variant="light" style={{ width: "100%"}}> 요청 </Button> </td>
                            </tr>
                        </tbody>
                    </Table>
                    
                </Form>
            </Row>
        
            <Row style={{display: "flex", justifyContent: "center", height: "65vh", overflow: "auto"}}>
                <Table>
                    <thead className="sticky-header">
                        <tr>
                            <th style={{ width: "7%" }}> 
                                <Dropdown onSelect={(eventKey) => Filter({monthF: eventKey})}> 
                                    <Dropdown.Toggle as={Button} variant="light" style={{width: "100%", color: "black"}}>
                                        { `요청일 : ${monthFilter}`}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={{fontSize: "1.5vh", textAlign: "center"}}>
                                        { ["전체", ...monthList].map((item, index) => {
                                            return (
                                                <Dropdown.Item key={index} eventKey={item}> {item} </Dropdown.Item>
                                            );
                                        })};
                                    </Dropdown.Menu>
                                </Dropdown> 
                            </th>
                            <th style={{ width: "7%" }}> <Button variant="light"> 기한 </Button> </th>
                            <th style={{ width: "10%" }}> 
                                <Dropdown onSelect={(eventKey) => Filter({ belongF: eventKey})}> 
                                    <Dropdown.Toggle as={Button} variant="light" style={{width: "100%", color: "black"}}>
                                        {`소속: ${belongFilter}`}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={{fontSize: "1.5vh", textAlign: "center"}}>
                                        { ["전체",...belongList].map((item, index) => {
                                            return (
                                                <Dropdown.Item key={index} eventKey={item}> {item} </Dropdown.Item>
                                            );
                                        })};
                                    </Dropdown.Menu>
                                </Dropdown> 
                            </th>
                            <th style={{ width: "5%" }}> <Button variant="light"> 요청자 </Button> </th>
                            <th style={{ width: "5%" }}> <Button variant="light"> 고객사 </Button> </th>
                            <th style={{ width: "10%" }}> <Button variant="light"> 카테고리 </Button> </th>
                            <th style={{ width: "10%" }}> <Button variant="light"> 범주 </Button> </th>
                            <th style={{ width: "20%" }}> <Button variant="light"> 상세 </Button> </th>
                            <th style={{ width: "20%" }}> <Button variant="light"> 첨부파일 </Button> </th>
                            <th style={{ width: "5%" }}> 
                                <Dropdown onSelect={(eventKey) => Filter({statusF: eventKey})}>
                                    <Dropdown.Toggle as={Button} variant="light" style={{width: "100%", color: "black"}}>
                                        {`현황 : ${statusFilter}`}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={{fontSize: "1.5vh", textAlign: "center"}}>
                                        {statusList.map((item, index) => {
                                            return (
                                                <Dropdown.Item key={index} eventKey={item}> {item} </Dropdown.Item>
                                            )
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </th>
                        </tr>
                    </thead>
                    <tbody style={{verticalAlign: "middle"}}>
                        { filteredList.map((item, index) => {
                            
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
                                    category={item.category}
                                    range={item.range}
                                    detail={item.detail}
                                    file = {item.file}
                                    status={item.status}
                                    UpdateRequest={UpdateRequest}
                                    />
                                )
                        })}
                    </tbody>
                </Table>
            </Row>
        </Container>
    );

};

export default MediaBoard;