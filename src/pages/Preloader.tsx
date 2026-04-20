type PreloaderProps = {
  isVisible: boolean
}

function Preloader({ isVisible }: PreloaderProps) {
  return (
    <div
      className={`fixed inset-0 z-[999] grid place-items-center bg-[#070a12] transition-all duration-500 ${isVisible ? 'visible opacity-100' : 'invisible pointer-events-none opacity-0'}`}
      aria-hidden={!isVisible}
      aria-label="Loading"
    >
      <div className="h-14 w-14 animate-spin rounded-full border-[3px] border-white/20 border-t-[#3dd7b4]" />
    </div>
  )
}

export default Preloader