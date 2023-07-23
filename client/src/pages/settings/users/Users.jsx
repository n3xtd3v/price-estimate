import { useState } from "react";
import DataTable from "../../../components/dataTable/DataTable";
import FaceIcon from '@mui/icons-material/Face';
import { userRows } from "../../../data";
import Add from "../../../components/add/Add";
import './users.scss'
import {
    useQuery,
} from '@tanstack/react-query'

const columns = [
    {
        field: 'id',
        headerName: 'ID',
        width: 90
    },
    {
        field: 'img',
        headerName: 'Avatar',
        width: 100,
        renderCell: (params) => {
            return <img src={params.row.img || <FaceIcon />} alt="" />
        }
    },
    {
        field: 'firstName',
        headerName: 'First name',
        width: 150,
        type: 'string',
    },
    {
        field: 'lastName',
        headerName: 'Last name',
        width: 150,
        type: 'string',
    },
    {
        field: 'email',
        headerName: 'Email',
        width: 200,
        type: 'string',
    },
    {
        field: 'phone',
        headerName: 'Phone',
        type: 'string',
        width: 200,
    },
    {
        field: 'createdAt',
        headerName: 'Created At',
        type: 'string',
        width: 200,
    },
    {
        field: 'verified',
        headerName: 'Verified',
        width: 150,
        type: 'boolean'
    },
    // {
    //     field: 'fullName',
    //     headerName: 'Full name',
    //     description: 'This column has a value getter and is not sortable.',
    //     sortable: false,
    //     width: 160,
    //     valueGetter: (params) =>
    //         `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    // },
];


const Users = () => {

    const [open, setOpen] = useState(false)

    const { isLoading, data } = useQuery({
        queryKey: ['allusers'],
        queryFn: () =>
            fetch('http://localhost:5051/api/users').then(
                (res) => res.json(),
            ),
    })

    return (
        <div className="users">
            <div className="info">
                <h1>Users</h1>
                <button onClick={() => setOpen(true)}>Add New User</button>
            </div>
            {isLoading
                ? 'Loading...'
                : <DataTable slug="users" columns={columns} rows={data} />}
            {open && <Add slug="users" columns={columns} setOpen={setOpen} />}
        </div>
    )
}

export default Users 