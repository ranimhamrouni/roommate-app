import AuthToggle from "./AuthToggle"

const AuthCard = ({title, children} : {title: string, children: React.ReactNode}) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F5F0E8] relative overflow-hidden">
        <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] rounded-full bg-[#C8E6C9] opacity-50 blur-3xl" />
        <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] rounded-full bg-[#D8C8F0] opacity-50 blur-3xl" />
        <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] rounded-full bg-[#F4C9B0] opacity-40 blur-3xl" />
        
        <div className="relative z-10 bg-white rounded-3xl shadow-lg p-8 w-full max-w-md font-heading">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{title}</h1>
            <AuthToggle/>
            {children}
        </div>

      </div>
  )
}

export default AuthCard
