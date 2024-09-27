// src/controllers/requestController.ts
import { Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';

const filePath = path.join(__dirname, '../../data/requests.json');

interface RequestData {
  id: string;
  guestName: string;
  roomNumber: number;
  requestDetails: string;
  priority: number;
  status: 'received' | 'in progress' | 'awaiting confirmation' | 'completed' | 'canceled';
}

const statusOrder = ['received', 'in progress', 'awaiting confirmation', 'completed', 'canceled'];

const readRequestsFromFile = async (): Promise<RequestData[]> => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data) as RequestData[];
  } catch (error) {
    console.error('Error reading requests:', error);
    return [];
  }
};

const writeRequestsToFile = async (requests: RequestData[]): Promise<void> => {
  try {
    await fs.writeFile(filePath, JSON.stringify(requests, null, 2));
  } catch (error) {
    console.error('Error writing requests:', error);
  }
};

export const getRequests = async (req: Request, res: Response) => {
  try {
    const requests = await readRequestsFromFile();
     const { sortBy } = req.query;

    let sortedRequests = requests;

    if (sortBy) {
      sortedRequests = requests.sort((a, b) => {
        if (sortBy === 'priority') {
          return a.priority - b.priority;
        } else if (sortBy === 'status') {
      
           return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        }
        return 0;
      });
    }

    res.json(sortedRequests);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};

export const getRequestById = async (req: Request, res: Response) => {
  try {
    const requests = await readRequestsFromFile();
    const request = requests.find(r => r.id === req.params.id);
    if (!request) res.status(404).send('Request not found');
    res.json(request);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};

export const addRequest = async (req: Request, res: Response) => {
  try {
    const requests = await readRequestsFromFile();
    const newRequest: RequestData = { ...req.body, id: String(Date.now()) , status:"received"};
    requests.push(newRequest);
    await writeRequestsToFile(requests);
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};

export const updateRequest = async (req: Request, res: Response) => {
  try {
    const requests = await readRequestsFromFile();
    const index = requests.findIndex(r => r.id === req.params.id);
    if (index === -1)  res.status(404).send('Request not found');
    requests[index] = { ...requests[index], ...req.body };
    await writeRequestsToFile(requests);
    res.json(requests[index]);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};

export const deleteRequest = async (req: Request ,res: Response) => {
  try {
    const requests = await readRequestsFromFile();
    const filteredRequests = requests.filter(r => r.id !== req.params.id);
    if(filteredRequests.length===requests.length) res.status(404).send("Record not found")
    await writeRequestsToFile(filteredRequests);
    res.status(204).send("Record deleted Successfully");
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};

export const completeRequest = async (req: Request, res: Response) => {
  try {
    const requests = await readRequestsFromFile();
    const index = requests.findIndex(r => r.id === req.params.id);
    if (index === -1)  res.status(404).send('Request not found');
    requests[index].status = 'completed';
    await writeRequestsToFile(requests);
    res.json(requests[index]);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};
