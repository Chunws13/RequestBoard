import axios from "axios";
import { Dropdown, Button } from "react-bootstrap";

const MediaRequest = ({
    id, start_date, end_date, belong, requester, customer, 
    stack, reference, detail, status, UpdateRequest}) => {

    const AdjustStatus = async(eventKey) => {
        try{
            const response = await axios.put(`http://127.0.0.1:8000/api/tech/?id=${id}`,
                            {status: eventKey},
                            {
                                headers:{ 
                                    "Content-Type": "application/json"
                            }});
            
            UpdateRequest(response.data);

        } catch {
            alert("에러");
        };
    };
    
    return (
        <tr>
            <td> {start_date} </td>
            <td> {end_date} </td>
            <td> {belong} </td>
            <td> {requester} </td>
            <td> {customer} </td>
            <td> {stack} </td>
            <td> {reference} </td>
            <td> {detail} </td>
            <td>
                <Dropdown onSelect={AdjustStatus}>
                    <Dropdown.Toggle as={Button} variant="light" style={{width: "100%", color: "black"}}>
                        {status}
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{textAlign: "center"}}>
                        <Dropdown.Item eventKey="보류">보류</Dropdown.Item>
                        <Dropdown.Item eventKey="완료">완료</Dropdown.Item>
                        <Dropdown.Item eventKey="처리중">처리중</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </td>
        </tr>
    )
}

export default MediaRequest;