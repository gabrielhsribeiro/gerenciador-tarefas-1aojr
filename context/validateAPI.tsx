import moment from "moment";

//funcao para definir formato dos inputs necessários para a API de usuário de maneira a ser chamado tanto via HTML quanto via API (por meio do Postman, por exemplo)
export const validateUserAPI = (name: string, email: string, password: string) =>{
    const error_msg='';

    if(!name || !email || !password){
        const error_msg='Favor preencher os campos!';
        return error_msg;
    }

    if(name.length <= 2){
        const error_msg='Nome precisa ter mais que 2 caracteres';
        return error_msg;
    }

    const emailFormat = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if(!email.match(emailFormat)){
        const error_msg='E-mail não é válido';
        return error_msg;
    }

    if(password.length < 6){
        const error_msg='Senha precisa possuir pelo menos 6 caracteres';
        return error_msg;
    }

    return error_msg;
}

export const validateTaskSaveAPI = (name: string, finishPrevisionDate: string) =>{
    const error_msg='';

    if(!name || !finishPrevisionDate){
        const error_msg='Favor preencher os campos!';
        return error_msg;
    }

    if (name.length < 2) {
        const error_msg='Nome da tarefa precisa ter pelo menos dois caracteres';
        return error_msg;
    }

    //adicionei moment().subtract(1, 'days') para permitir salvar tarefas que pretendo finalizar no mesmo dia que criei
    if (moment(finishPrevisionDate).isBefore(moment().subtract(1, 'days'))) {
        const error_msg='Data de previsão não pode ser anterior a hoje';
        return error_msg;
    }

    return error_msg;
}

export const validateTaskUpdateAPI = (name:string, finishPrevisionDate: string, createdDate: string, finishDate: string) =>{
    const error_msg='';

    console.log(createdDate);
    if (!name || !finishPrevisionDate) {
        const error_msg='Favor preencher os campos!';
        return error_msg;
    }

    if (name.length < 2) {
        const error_msg='Nome da tarefa  precisa ter pelo menos dois caracteres';
        return error_msg;
    }

    //como, ao alterar uma task já existente, é possível cadastrar uma data de previsão muito mais antiga, acabei limitando a alteração à data de criação
    if (moment(finishPrevisionDate).isBefore(moment(createdDate).subtract(1, 'days'))) {
        const error_msg=`Nova data de previsão não pode ser anterior à data de criação da tarefa (tarefa criada em ${moment(createdDate).format('DD/MM/yyyy')})`;
        return error_msg;
    }

    if (finishDate!='' && moment(finishDate).isBefore(moment(createdDate).subtract(1, 'days'))) {
        const error_msg=`Data de conclusão da tarefa não pode ser anterior à data de criação da tarefa (tarefa criada em ${moment(createdDate).format('DD/MM/yyyy')})`;
        return error_msg;
    }

    return error_msg;
}
