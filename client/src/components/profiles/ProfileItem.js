import React from 'react'
import PropTypes from 'prop-types'
import Spinner from '../layout/Spinner'
import { Link } from 'react-router-dom'

const ProfileItem = ({ profile: {
    user: { _id, name, avatar },
    status,
    company,
    location,
    skills
    } 
}) => {
    return (
        <div className="profile bg-light">
            <img className="round-img" src={avatar} alt="avatar" />
            <div>
                <h2>{name}</h2>
                <p>{status} {company && <span>at {company}</span>}</p>
                <p className="my-1">{location && <span>{location}</span>}</p>
                <Link to={`/profile/${_id}`} className='btn btn-primary'>
                    View Profile
                </Link>
            </div>
            <ul>
                {skills.slice(0, 4).map((skill, index) => (
                    <li key={index} className="text-primary">
                        <i className="fas fa-check"></i> {skill}
                    </li>
                ))}
                {skills.length > 4 ? <li><Link to={`/profile/${_id}`}>
                    ...
                </Link></li> : null}
            </ul>
        </div>
    )
}

ProfileItem.propTypes = {
    profile: PropTypes.object.isRequired
}

export default ProfileItem
