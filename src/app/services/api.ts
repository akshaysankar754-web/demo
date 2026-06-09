import { Injectable, inject } from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

@Injectable({
  providedIn:'root'
})
export class ApiService {

  private http = inject(HttpClient);

  private baseUrl =
  'http://localhost:5193/api';

  register = (data:any) =>
  {
    return this.http.post(
      `${this.baseUrl}/Auth/register`,
      data
    );
  };

  login = (data:any) =>
  {
    return this.http.post(
      `${this.baseUrl}/Auth/login`,
      data
    );
  };

  verifyEmail = (data:any) =>
  {
    return this.http.post(
      `${this.baseUrl}/Auth/verify-email`,
      data
    );
  };

  verifyLogin = (data:any) =>
  {
    return this.http.post(
      `${this.baseUrl}/Auth/verify-login`,
      data
    );
  };

  getAdminInternships = () =>
  {
    return this.http.get(
      `${this.baseUrl}/Internship/admin`,
      {
        headers:this.getHeaders()
      }
    );
  };

  getInternships = () =>
  {
    return this.http.get(
      `${this.baseUrl}/Internship`,
      {
        headers:this.getHeaders()
      }
    );
  };

  getApplicationsForInternship = (
    internshipId:number
  ) =>
  {
    return this.http.get(
      `${this.baseUrl}/Application/internship/${internshipId}`,
      {
        headers:this.getHeaders()
      }
    );
  };
getStudyMaterials = () =>
{
  return this.http.get(
    `${this.baseUrl}/Material`,
    {
      headers:this.getHeaders()
    }
  );
};
createStudyMaterial = (data:any) =>
{
  return this.http.post(
    `${this.baseUrl}/Material`,
    data,
    {
      headers:this.getHeaders()
    }
  );
};
setFeedbackStatus = (isOpen:boolean) =>
{
  return this.http.put(
    `${this.baseUrl}/Feedback/status`,
    {
      isFeedbackOpen: isOpen
    },
    {
      headers:this.getHeaders()
    }
  );
};
getFeedbackStatus = () =>
{
  return this.http.get(
    `${this.baseUrl}/Feedback/status?t=${new Date().getTime()}`,
    {
      headers:this.getHeaders()
    }
  );
};

  getProfile = () =>
  {
    return this.http.get(
      `${this.baseUrl}/Auth/profile`,
      {
        headers:this.getHeaders()
      }
    );
  };

  updateProfile = (data:any) =>
  {
    return this.http.put(
      `${this.baseUrl}/Auth/profile`,
      data,
      {
        headers:this.getHeaders()
      }
    );
  };

  getAdminStats = () =>
  {
    return this.http.get(
      `${this.baseUrl}/Internship/stats`,
      {
        headers:this.getHeaders()
      }
    );
  };

  getAllApplications = () =>
  {
    return this.http.get(
      `${this.baseUrl}/Application/all`,
      {
        headers:this.getHeaders()
      }
    );
  };


  createInternship = (data:any) =>
  {
    return this.http.post(
      `${this.baseUrl}/Internship/create`,
      data,
      {
        headers:this.getHeaders()
      }
    );
  };

  applyInternship = (id:number) =>
  {
    return this.http.post(
      `${this.baseUrl}/Application/apply/${id}`,
      {},
      {
        headers:this.getHeaders()
      }
    );
  };

  getMyApplications = () =>
  {
    return this.http.get(
      `${this.baseUrl}/Application/myapplications`,
      {
        headers:this.getHeaders()
      }
    );
  };

  getMyCourse = () =>
  {
    return this.http.get(
      `${this.baseUrl}/Application/mycourse`,
      {
        headers:this.getHeaders()
      }
    );
  };

  updateApplicationStatus = (
    applicationId:number,
    status:string
  ) =>
  {
    return this.http.put(
      `${this.baseUrl}/Application/${applicationId}/status`,
      {
        status
      },
      {
        headers:this.getHeaders()
      }
    );
  };

  submitFeedback = (data:any) =>
  {
    return this.http.post(
      `${this.baseUrl}/Feedback`,
      data,
      {
        headers:this.getHeaders()
      }
    );
  };

  getFeedbacks = () =>
  {
    return this.http.get(
      `${this.baseUrl}/Feedback`,
      {
        headers:this.getHeaders()
      }
    );
  };

  private getHeaders()
  {
    const token = localStorage.getItem('token');

    if (!token) {
      return new HttpHeaders();
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

}