import { PlaneTakeoff } from 'lucide-react'
import Link from 'next/link'

const Logo = () => {
    return (
        <Link href={'/'}>
            <div className="flex items-center gap-3">
                <PlaneTakeoff />
                <h3 className='text-lg font-bold'>Travel Buddy</h3>
            </div>
        </Link>
    )
}

export default Logo
