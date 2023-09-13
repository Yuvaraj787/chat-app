import React, {useState} from 'react'
import axios from 'axios';
import { useEffect } from 'react';
import { Cookies } from 'react-cookie';
import { ApiUrl } from '../../components/comVars';
function Profile() {
	const [details, setDetails] = useState({});
	const [loading, setLoading] = useState(true);
	const cookie = new Cookies();
	useEffect(()=>{
		axios.get(ApiUrl + "/myprofile",{
			headers: {
				"authtoken" : cookie.get("token")
			}
		}).then((res)=>{
			console.log(res.data.details);
			setDetails(res.data.details);
			setLoading(false);
		})
	},[])
	const updateAbout = () => {
		axios.get(ApiUrl + "/setAbout", {
			params: {
				about:document.getElementById("about-value").value
			},
			headers: {
				"authtoken" : cookie.get("token")
			}
		}).then((res) => {
			if (res.data.success) {
				alert("about updated successfully");
			}
		})
	}
  return (
	loading ? <h1>Loading</h1> : 
	<section className="py-5 my-5">
		<div className="container">
			<div className="bg-white shadow rounded-lg d-block d-sm-flex">
				<div className="profile-tab-nav border-right">
					<div className="p-4">
						<div className="img-square text-center mb-3" >
							<img src={details.dpimg} alt="Image" className="shadow img-prof" />
						</div>
						<h4 className="text-center">{details.username}</h4>
					</div>
					{/* <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
						<a className="nav-link active" id="account-tab" data-toggle="pill" href="#account" role="tab" aria-controls="account" aria-selected="true">
							<i className="fa fa-home text-center mr-1"></i> 
							Account
						</a>
						<a className="nav-link" id="password-tab" data-toggle="pill" href="#password" role="tab" aria-controls="password" aria-selected="false">
							<i className="fa fa-key text-center mr-1"></i> 
							Password
						</a>
						<a className="nav-link" id="notification-tab" data-toggle="pill" href="#notification" role="tab" aria-controls="notification" aria-selected="false">
							<i className="fa fa-bell text-center mr-1"></i> 
							Notification
						</a>
					</div> */}
				</div>
				<div className="tab-content p-4 p-md-5" id="v-pills-tabContent">
					<div className="tab-pane fade show active" id="account" role="tabpanel" aria-labelledby="account-tab">
						<h3 className="mb-4">Account Settings</h3>
						<div className="row">
							<div className="col-md-6">
								<div className="form-group">
								  	<label>Username</label>
								  	<input type="text" className="form-control" value={details.username} />
								</div>
							</div>
							{/* <div className="col-md-6">
								<div className="form-group">
								  	<label>Last Name</label>
								  	<input type="text" className="form-control" value="Khan" />
								</div>
							</div> */}
							<div className="col-md-6">
								<div className="form-group">
								  	<label>Email</label>
								  	<input type="text" className="form-control" value={details.email} />
								</div>
							</div>
							<div className="col-md-6">
								<div className="form-group">
								  	<label>Phone number</label>
								  	<input type="text" className="form-control" value={details.phone} />
								</div>
							</div>
							
							<div className="col-md-12">
								<div className="form-group">
								  	<label>About</label>
									<textarea className="form-control" rows="4" id="about-value">{details.about == null ? "About Not yet set" : details.about}</textarea>
								</div>
							</div>
						</div>
						<div>
							<button className="btn btn-primary" onClick={updateAbout}>Update about</button>
						</div>
					</div>
					<div className="tab-pane fade" id="password" role="tabpanel" aria-labelledby="password-tab">
						<h3 className="mb-4">Password Settings</h3>
						<div className="row">
							<div className="col-md-6">
								<div className="form-group">
								  	<label>Old password</label>
								  	<input type="password" className="form-control" />
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-md-6">
								<div className="form-group">
								  	<label>New password</label>
								  	<input type="password" className="form-control" />
								</div>
							</div>
							<div className="col-md-6">
								<div className="form-group">
								  	<label>Confirm new password</label>
								  	<input type="password" className="form-control" />
								</div>
							</div>
						</div>
						<div>
							<button className="btn btn-primary" onClick={updateAbout}>Update about</button>
							{/* <button className="btn btn-light">Reset</button> */}
						</div>
					</div>
					
					<div className="tab-pane fade" id="notification" role="tabpanel" aria-labelledby="notification-tab">
						<h3 className="mb-4">Notification Settings</h3>
						<div className="form-group">
							<div className="form-check">
								<input className="form-check-input" type="checkbox" value="" id="notification1" />
								<label className="form-check-label" for="notification1">
									 Adnan is a Good Boy
								</label>
							</div>
						</div>
						<div className="form-group">
							<div className="form-check">
								<input className="form-check-input" type="checkbox" value="" id="notification2" />
								<label className="form-check-label" for="notification2">
									Adnan is very very good boy
								</label>
							</div>
						</div>
						<div className="form-group">
							<div className="form-check">
								<input className="form-check-input" type="checkbox" value="" id="notification3" />
								<label className="form-check-label" for="notification3">
									Adnan is very excellent boy
								</label>
							</div>
						</div>
						<div>
							<button className="btn btn-primary">Update</button>
							<button className="btn btn-light">Reset</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
  )
}

export default Profile;
	