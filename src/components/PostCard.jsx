import service from '../appwrite/appwrite_Config'
import { Link } from 'react-router-dom'

function Postcard({ $id, title, featuredImage }) {

  return (
    <Link to={`/post/${$id}`}>
      <div className='w-full bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 hover:border-gray-300'>

        {featuredImage && (
          <div className='w-full justify-center mb-4'>
            <img
              src={service.getFilePreview(featuredImage)}
              alt={title}
              className='rounded-xl w-full h-64 object-cover'
            />
          </div>
        )}

        <h2 className='text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200'>{title}</h2>

      </div>
    </Link>
  )
}

export default Postcard