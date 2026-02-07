export function useImageRules() {

  const validateBeforeSave = (image) => {

    if (!image.preview) {
      throw new Error('Imagem inválida ou não editada')
    }

    if (!image.page) {
      throw new Error('Selecione a página de exibição')
    }

    if (!image.location) {
      throw new Error('Selecione a localização da imagem')
    }

    // if (!image.desktop && !image.mobile) {
    //   throw new Error('Selecione ao menos um dispositivo (desktop ou mobile)')
    // }

    // Regras por página
    validatePageRules(image)
  }

  /**
   * Regras específicas por página
   */
  const validatePageRules = (image) => {
    const { page, location, devices } = image
    const { desktop, mobile } = devices

    // HOME
    if (page === 'home') {
      if (!['Hero', 'About', 'App', 'Scheadle'].includes(location)) {
        throw new Error('Localização inválida para Home')
      }

      if (location === 'Hero' && (!desktop && !mobile)) {
        throw new Error(`Hero da Home exige imagem Desktop e Mobile ${mobile?'':'(falta Mobile)'} ${desktop?'':'(falta Desktop)'}`)
      }
    }

    // ABOUT
    if (page === 'about') {
      if (!['Aboutchurch', 'Aboutpastors'].includes(location)) {
        throw new Error('Localização inválida para Sobre')
      }
    }

    // ACTIVITIES
    if (page === 'activities') {
      if (!location) {
        throw new Error('Selecione a atividade relacionada')
      }
    }

    // LOGO
    if (page === 'logo') {
      if (desktop && mobile) {
        throw new Error('Logo não deve ser marcado para desktop e mobile ao mesmo tempo')
      }
    }
  }

  return {
    validateBeforeSave
  }
}

