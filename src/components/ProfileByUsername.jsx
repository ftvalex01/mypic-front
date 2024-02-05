import React, { useEffect, useState } from 'react';
import { FaCog, FaPlusCircle } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import useAuthContext from '../context/AuthContext';

const ProfileByUsername = () => {
    const { username } = useParams();
    const { fetchUserByUsername } = useAuthContext();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const userData = await fetchUserByUsername(username);
                setProfile(userData);
            } catch (error) {
                console.error("Error fetching user profile:", error);
                // Manejar el error o establecer un estado para mostrar un mensaje adecuado
            }
        };

        loadUserProfile();
        // console.log(profile.profile_picture);

    }, [username, fetchUserByUsername]);

    if (!profile) {
        // Aquí puedes manejar el estado de carga o mostrar un mensaje si el perfil no existe
        return <div>Cargando perfil...</div>;
    };

    let changedUrl = 'http://localhost:8000/storage/' + profile.profile_picture;

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col justify-center md:flex-row md:items-center">
                <img
                    src={changedUrl}
                    alt="Profile"
                    className="rounded-full w-20 h-20 md:w-40 md:h-40"
                />

                <div className="md:ml-4">
                    <h1 className="text-xl font-bold">{profile.username}</h1>
                    
                    <div className="flex space-x-4">
                        <span>{profile.postsCount} publicaciones</span>
                        <span>{profile.followersCount} seguidores</span>
                        <span>{profile.followingCount} seguidos</span>
                    </div>
                    <p>{profile.bio}</p>
                </div>
            </div>
            
            <hr className="my-4" />

            <div className="grid grid-cols-3 gap-3 justify-center ">
                {/* {userPosts.map((post, index) => (
              <img key={index} src={post} alt={`Post ${index}`} className="w-80" />
            ))} */}
            </div>
        </div>
    );
};

export default ProfileByUsername;
