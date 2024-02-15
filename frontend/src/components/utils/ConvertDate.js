export const ConvertDate = ({ datetime }) => {
    const year = datetime.getFullYear();
        let month = datetime.getMonth() + 1;
        let day = datetime.getDate();
        
        month = month.toString().length === 1 ? `0${month}` : month
        day = day.toString().length === 1 ? `0${day}` : day

        return `${year}.${month}.${day}`;
};