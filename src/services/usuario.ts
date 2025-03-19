import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from '@/config/firebase';
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

const UsuarioService = {

    /**
     * Loga usuário
     * @param email 
     * @param senha 
     * @returns {usuario caso logado com sucesso, e o sucesso com um status de logado ou não}
     */
    logar: async(email: string, senha: string): Promise<{usuario?:any, sucesso:boolean}> => {
        return signInWithEmailAndPassword(auth, email, senha)
            .then(async (retorno) => { 
                //Verifica se o usuario não foi excluido do banco
                const dados = await getDoc(doc(db, 'users', retorno.user.uid));
                console.log('A');
                dados.exists(dados.exists())
                if (dados.exists())
                    return { sucesso: true , usuario: retorno.user}
                return { sucesso: false };
            
            })
            .catch(erro => { return { sucesso: false }});
    },

    /**
     * Função para recuperar senha
     * @param email 
     * @returns sucesso status booleano caso tenha conseguido solicitar nova senha
     */
    recuperarSenha: async (email: string): Promise<{sucesso: boolean}> => {
        return sendPasswordResetEmail(auth, email)
            .then((retorno) => { return { sucesso: true }})
            .catch(erro => { return { sucesso: false }});
    },

    /**
     * Retorna a lista de usuários do sistema
     * @returns 
     */
    buscarUsuarios: async (): Promise<any[]> => {
        return getDocs(collection(db, 'users'))
            .then(snapshots => {
                const retorno: any[] = [];
                snapshots.forEach(snap => {
                    retorno.push(snap.data())
                })
                return retorno;
            })
            .catch(erro => [])
    },

    /**
     * Retorna os dados de um usuário
     * @param id 
     * @returns 
     */
    buscar: async (id: string): Promise<any>  => {
        return getDoc(doc(db, 'users', id))
            .then(retorno => { 
                return (retorno.exists() ? retorno.data() : null)
            })
            .catch(erro => null)
    },

    /**
     * Cadastra um novo usuário
     * @param usuario 
     * @returns 
     */
    cadastrar: async (usuario:any): Promise<{sucesso: boolean}> => {
        return createUserWithEmailAndPassword(auth, usuario.email, usuario.senha)
            .then(async retorno => {
                usuario.uid = retorno.user.uid;
                delete usuario.senha;

                const usuarioDOC = doc(db, 'users', usuario.uid)

                await setDoc(usuarioDOC, usuario);
                return { sucesso: true };
            })
            .catch(erro => { return { sucesso: false} });
    },
    
    /**
     * Excluir um usuario
     * @param usuario 
     * @returns 
     */
    excluir: async (usuario:any): Promise<{sucesso: boolean}> => {
        return deleteDoc(doc(db, 'users', usuario.uid))
            .then(retorno => {
                return { sucesso: true }
            })
            .catch(erro => {
                return { sucesso: false }
            })
    }


}


export const useUsuarioService = () => UsuarioService;