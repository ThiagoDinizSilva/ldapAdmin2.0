# DryadAdmin
DriadeLdap

[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

A Ideia foi criar uma API que pudesse servir um Front-End mais "amigavel" para gerenciar
o LDAP,possibilitando alterações nos usuarios e grupos com um frontend ao invés da interface
do LdapAdmin. Algumas das funções incluem:
  - adicionar,remover,modificar e excluir usuarios e grupos; 
  - middleware para verificar se o usuario está logado;
  - filtros para evitar que todos os usuarios sejam deltados ou alterados de uma só vez;
  - todas as requisições são testadas antes de serem executadas, e retornam uma mensagem de erro
  facilitando a correção;
  
  
  
### Built With

* [NodeJS](https://nodejs.org/en/)
* [express](https://expressjs.com/)
* [crypto-js](https://www.npmjs.com/package/crypto-js)
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
* [ldapts](https://github.com/ldapts/ldapts)
* [sequelize](https://sequelize.org/)

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.


<!-- PROJECT VERSIONS -->
## Project Versions
---Version v1.0.0---


<!-- CONTACT -->
## Contact
- E-Mail: profissional.thiagodiniz@gmail.com 
- [Twitter](https://twitter.com/your_username)
- [Linkedin](https://www.linkedin.com/in/thiagodinizdasilva/)


<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [Img Shields](https://shields.io)
* [Choose an Open Source License](https://choosealicense.com)
* [README Template](https://github.com/othneildrew/Best-README-Template/blob/master/README.md#contact)

<!-- MARKDOWN LINKS & IMAGES -->
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/thiagodinizdasilva/
