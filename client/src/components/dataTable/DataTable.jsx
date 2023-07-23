import { Link } from "react-router-dom";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import './dataTable.scss'
import { useMutation, useQueryClient } from "@tanstack/react-query";

const DataTable = (props) => {

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (id) => {
            return fetch(`http://localhost:5051/api/${props.slug}/${id}`, {
                method: 'delete'
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries([`all${props.slug}`])
        }
    })

    const handleDelete = (id) => {
        mutation.mutate(id)
    }

    const actionColumn = {
        field: 'action',
        headerName: 'Action',
        width: 200,
        renderCell: (params) => {
            return (
                <div className="action">
                    <Link to={`/${props.slug}/${params.row.id}`}>
                        <EditIcon />
                    </Link>
                    <div className="delete" onClick={() => handleDelete(params.row.id)}>
                        <DeleteIcon />
                    </div>
                </div>
            )
        }
    }

    return (
        <div className='dataTable'>
            <DataGrid
                className='dataGrid'
                rows={props.rows}
                columns={[...props.columns, actionColumn]}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 }
                    }
                }}
                pageSizeOptions={[10]}
                checkboxSelection
                disableRowSelectionOnClick
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
            />
        </div>
    )
}

export default DataTable