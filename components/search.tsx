import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const SearchBar = () => {
    return (
        <div className='relative'>
            <div className='absolute top-2 left-4'>
                <FontAwesomeIcon icon={faSearch} className='w-4 h-4 text-black opacity-50' />
            </div>
            <input
                type='text'
                placeholder='검색어를 입력하세요.'
                className='bg-black bg-opacity-10 placeholder:text-black placeholder:opacity-50 w-full py-2 pl-12 pr-5 rounded-full focus:outline-none focus:ring-2 focus:ring-instend'
            />
        </div>
    )
}

export default SearchBar