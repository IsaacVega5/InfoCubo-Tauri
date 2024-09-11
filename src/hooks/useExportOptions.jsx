export const useExportOptions = () => {
  const expoCont = document.querySelector('.expo-cont')
  
  const open = () => {
    expoCont.style.display = 'flex'
  }
  const close = () => {
    expoCont.style.display = 'none'
  }
  const toggle = () => {
    expoCont.style.display == 'none' ? open() : close()
  }

  return {open, close, toggle}
}