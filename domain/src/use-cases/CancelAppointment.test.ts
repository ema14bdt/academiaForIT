import { CancelAppointment } from './CancelAppointment';
import { IAppointmentRepository } from './ports/IAppointmentRepository';
import { Appointment } from '@domain/entities/Appointment';
import { AppointmentAlreadyCancelledError, AppointmentNotFoundError, UnauthorizedCancellationError } from '@domain/shared/errors';

const mockAppointmentRepo: jest.Mocked<IAppointmentRepository> = {
  findById: jest.fn(),
  findManyByDateRange: jest.fn(),
  findByUserId: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
};

describe('CancelAppointment Use Case', () => {
  const useCase = new CancelAppointment(mockAppointmentRepo);
  let confirmedAppointment: Appointment;
  let cancelledAppointment: Appointment;

  beforeEach(() => {
    jest.clearAllMocks();
    confirmedAppointment = {
      id: 'appt-1',
      clientId: 'client-1',
      serviceId: 'service-1',
      startTime: new Date('2025-12-20T09:00:00Z'),
      endTime: new Date('2025-12-20T09:30:00Z'),
      status: 'confirmed',
    };
    cancelledAppointment = {
      ...confirmedAppointment,
      id: 'appt-2',
      status: 'cancelled',
    };
  });

  it('should allow an admin to cancel an appointment', async () => {
    mockAppointmentRepo.findById.mockResolvedValue(confirmedAppointment);
    await useCase.execute({ appointmentId: confirmedAppointment.id, cancellingUserId: null });
    expect(mockAppointmentRepo.findById).toHaveBeenCalledWith(confirmedAppointment.id);
    expect(mockAppointmentRepo.update).toHaveBeenCalledWith(expect.objectContaining({
      id: confirmedAppointment.id,
      status: 'cancelled',
    }));
  });

  it('should allow a client to cancel their own appointment', async () => {
    mockAppointmentRepo.findById.mockResolvedValue(confirmedAppointment);
    await useCase.execute({ appointmentId: confirmedAppointment.id, cancellingUserId: confirmedAppointment.clientId });
    expect(mockAppointmentRepo.findById).toHaveBeenCalledWith(confirmedAppointment.id);
    expect(mockAppointmentRepo.update).toHaveBeenCalledWith(expect.objectContaining({
      id: confirmedAppointment.id,
      status: 'cancelled',
    }));
  });

  it('should throw AppointmentNotFoundError if appointment does not exist', async () => {
    mockAppointmentRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute({ appointmentId: 'non-existent', cancellingUserId: null }))
      .rejects.toThrow(AppointmentNotFoundError);
  });

  it('should throw AppointmentAlreadyCancelledError if appointment is already cancelled', async () => {
    mockAppointmentRepo.findById.mockResolvedValue(cancelledAppointment);
    await expect(useCase.execute({ appointmentId: cancelledAppointment.id, cancellingUserId: null }))
      .rejects.toThrow(AppointmentAlreadyCancelledError);
  });

  it("should throw UnauthorizedCancellationError if client tries to cancel another user's appointment", async () => {
    mockAppointmentRepo.findById.mockResolvedValue(confirmedAppointment);
    await expect(useCase.execute({ appointmentId: confirmedAppointment.id, cancellingUserId: 'another-client' }))
      .rejects.toThrow(UnauthorizedCancellationError);
  });
});
