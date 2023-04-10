import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import enrollmentsService from '@/services/enrollments-service';
import { ViaCEPAddress } from '@/protocols';
import { CreateEnrollmentParams } from '@/repositories/enrollment-repository';

export async function getEnrollmentByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const enrollmentWithAddress = await enrollmentsService.getOneWithAddressByUserId(userId);

    return res.status(httpStatus.OK).send(enrollmentWithAddress);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function postCreateOrUpdateEnrollment(req: AuthenticatedRequest, res: Response, next:NextFunction) {
const {name, cpf, birthday, phone, address} =  req.body


  try {
    await enrollmentsService.createOrUpdateEnrollmentWithAddress({
      name,
      cpf,
      birthday,
      phone,
      userId: req.userId,
      address
    });

    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    //return res.sendStatus(httpStatus.BAD_REQUEST);
    next(error)
}
}

export async function getAddressFromCEP(req: AuthenticatedRequest, res: Response, next: NextFunction) {

  const {cep} = req.query

  try {
    const address: ViaCEPAddress = await enrollmentsService.getAddressFromCEPService(String(cep));
    res.status(httpStatus.OK).send(address);
  } catch (error) {
    next(error)
  }
}
