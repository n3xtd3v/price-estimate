import './add.scss'
import { useQueryClient, useMutation } from "@tanstack/react-query";

const Add = (props) => {

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: () => {
            return fetch(`http://localhost:5051/api/${props.slug}`, {
                method: 'post',
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: 111,
                    img: "",
                    lastName: 'Hello',
                    firstName: 'Test',
                    email: 'testme@gmail.com',
                    phone: '123 456 789',
                    createdAt: '01.02.2023',
                    verifield: true
                })
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries([`all${props.slug}`])
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        mutation.mutate()
        props.setOpen(false)
    }

    return (
        <div className='add'>
            <div className="modal">
                <span className='close' onClick={() => props.setOpen(false)}>X</span>
                <h1>Add new {props.slug}</h1>

                <form onClick={handleSubmit}>
                    {
                        props.columns.filter((item) => item.field !== 'id' && item.field !== 'img')
                            .map((column, index) => (
                                <div className="item" key={index}>
                                    <label>{column.headerName}</label>
                                    <input type={column.type} placeholder={column.field} />
                                </div>
                            ))
                    }

                    <button>Send</button>
                </form>
            </div>
        </div>
    )
}

export default Add