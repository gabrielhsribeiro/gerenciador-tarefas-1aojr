import moment from 'moment';
import type { NextApiRequest, NextApiResponse } from 'next';
import { validateTaskSaveAPI, validateTaskUpdateAPI } from '../../context/validateAPI';
import { connectToDB } from '../../middlewares/connectToDB';
import { jwtValidator } from '../../middlewares/jwtValidator';
import { TaskModel } from '../../models/Task';
import { UserModel } from '../../models/User';
import { DefaultMessageResponse } from '../../types/DefaultMessageResponse';
import { Task } from '../../types/Task';

const endpoint = async (req: NextApiRequest, res: NextApiResponse<DefaultMessageResponse | any>) => {
    try{
        const userId = req?.body?.userId ? req?.body?.userId : req?.query?.userId as string;
        const failedValidation = await validateUser(userId);
        if(failedValidation){
            return res.status(400).json({ error: failedValidation});
        }

        if(req.method === 'POST'){
            return await saveTask(req, res, userId);
        }else if(req.method === 'GET'){
            return await getTasks(req, res, userId);
        }else if(req.method === 'PUT'){
            return await updateTask(req, res, userId);
        }else if(req.method === 'DELETE'){
            return await deleteTask(req, res, userId);
        }

        res.status(400).json({ error: 'Método solicitado não existe '});
    }catch(e){
        console.log('Ocorreu erro ao gerenciar tarefas: ', e);
        res.status(500).json({ error: 'Ocorreu erro ao gerenciar tarefas, tente novamente '});
    }
}

const validateTaskAndReturnValue = async (req: NextApiRequest, userId: string) => {
    const id = req.query?.id as string;

    if (!id || id.trim() === '') {
        return null;
    }

    const taskFound = await TaskModel.findById(id);
    if (!taskFound || taskFound.userId !== userId) {
        return null;
    }

    return taskFound;
}

const updateTask = async (req: NextApiRequest, res: NextApiResponse<DefaultMessageResponse | Task[]>, userId: string) => {
    const taskFound = await validateTaskAndReturnValue(req, userId);
    if (!taskFound) {
        return res.status(400).json({ error: 'Tarefa não encontrada' });
    }

    if (req.body) {
        const task = req.body as Task;

        const error_msg=validateTaskUpdateAPI(task.name,task.finishPrevisionDate,taskFound.createdDate,task.finishDate);
        if(error_msg!==''){
            return res.status(400).json({error: error_msg});
        }

        if (task.name) {
            taskFound.name = task.name;
        }

        if (task.finishPrevisionDate) {
            taskFound.finishPrevisionDate = task.finishPrevisionDate;
        }

        if (task.finishDate) {
            taskFound.finishDate = task.finishDate;
        }

        await TaskModel.findByIdAndUpdate({ _id: taskFound._id }, taskFound);
        return res.status(200).json({ msg: 'Tarefa atualizada com sucesso' });
    }

    return res.status(400).json({ error: 'Parâmetros de entrada inválidos' });
}

const deleteTask = async (req: NextApiRequest, res: NextApiResponse<DefaultMessageResponse | Task[]>, userId: string) => {
    const taskFound = await validateTaskAndReturnValue(req, userId);
    if (!taskFound) {
        return res.status(400).json({ error: 'Tarefa não encontrada' });
    }

    await TaskModel.findByIdAndDelete({ _id: taskFound._id });
    return res.status(200).json({ msg: 'Tarefa deletada com sucesso' });
}

const getTasks = async (req: NextApiRequest, res: NextApiResponse<DefaultMessageResponse | Task[]>, userId: string) => {

    const params = req.query as any;

    const query = {
        userId
    } as any;

    if (params?.finishPrevisionStart) {
        const inputDate = moment(params?.finishPrevisionStart);
        query.finishPrevisionDate = { $gte: inputDate.format('yyyy-MM-DD') }
    }

    if (params?.finishPrevisionEnd) {
        const lastDate = moment(params?.finishPrevisionEnd);
        if (!query.finishPrevisionDate) {
            query.finishPrevisionDate = {};
        }
        query.finishPrevisionDate.$lte = lastDate.format('yyyy-MM-DD')
    }

    if (params?.status) {
        const status = parseInt(params?.status);
        switch (status) {
            case 1:
                query.finishDate = null;
            break;
            case 2:
                query.finishDate = { $ne: null };
            break;
            default:
            break;
        }
    }

    const result = await TaskModel.find(query) as Task[];
    return res.status(200).json(result);
}

const validateUser = async (userId: string) => {
    if (!userId) {
        return 'Usuário não informado';
    }

    const userFound = await UserModel.findById(userId);
    if (!userFound) {
        return 'Usuário não encontrado';
    }
}

const saveTask = async (req: NextApiRequest, res: NextApiResponse<DefaultMessageResponse>, userId: string) => {
    if (req.body) {
        const task = req.body as Task;

        const error_msg=validateTaskSaveAPI(task.name,task.finishPrevisionDate);
        if(error_msg!==''){
            return res.status(400).json({error: error_msg});
        }

        const final = {
            ...task,
            createdDate: moment(moment.utc(moment.utc().format('YYYY-MM-DD HH:mm:ss')).toDate()).local().format('YYYY-MM-DD HH:mm:ss'),
            userId,
            finishDate: undefined
        } as any;

        await TaskModel.create(final);
        return res.status(200).json({ msg: 'Tarefa criada com sucesso' });
    }

    return res.status(400).json({ error: 'Parâmetros de entrada inválido' });
}

export default connectToDB(jwtValidator(endpoint));