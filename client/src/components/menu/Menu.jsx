import { Link } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import SellIcon from '@mui/icons-material/Sell';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import './menu.scss';

const menu = [
    {
        id: 1,
        title: 'main',
        listItem: [
            {
                id: 1,
                title: 'dashboard',
                url: '/',
                icon: <DashboardIcon />
            },
            {
                id: 2,
                title: 'item price',
                url: '/item-price',
                icon: <SellIcon />
            },
            {
                id: 3,
                title: 'template',
                url: '/template',
                icon: <PostAddIcon />
            },
            {
                id: 4,
                title: 'request',
                url: '/request',
                icon: <DownloadRoundedIcon />
            }
        ]
    },
    {
        id: 2,
        title: 'settings',
        listItem: [
            {
                id: 1,
                title: 'users',
                url: '/settings/users',
                icon: <GroupOutlinedIcon />
            }
        ]
    }
]

const Menu = () => {
    return (
        <div className='menu'>
            {menu.map((item) => (
                <div className="item" key={item.id}>
                    <div className="title">{item.title}</div>
                    {item.listItem.map((listItem) => (
                        < Link to={listItem.url} className="listItem" key={listItem.id}>
                            <div>
                                {listItem.icon}
                            </div>
                            <span>{listItem.title}</span>
                        </Link>
                    ))
                    }
                </div>
            ))
            }
        </div >
    )
}

export default Menu