#include "Camera.h"
#include "Input.h"
#include <memory>

// Constructor
Camera::Camera(float aspectRatio, XMFLOAT3 initialPosition)
{
	// Set the transform and update matricies
	cam = std::make_shared<Transform>();
	cam->SetPosition(initialPosition.x, initialPosition.y, initialPosition.z);
	moveSpeed = 1;
	mouseSpeed = .01f;

	// Update both matricies
	UpdateViewMatrix();
	UpdateProjectionMatrix(aspectRatio);
}

// deconstructor
Camera::~Camera()
{
	// empty
}


// Setters
// Return view matrix
XMFLOAT4X4 Camera::GetViewMatrix()
{
	return view;
}

// Return projection matrix
XMFLOAT4X4 Camera::GetProjectionMatrix()
{
	return projection;
}

std::shared_ptr<Transform> Camera::GetTransform()
{
	return cam;
}

// Update projection matrix
void Camera::UpdateProjectionMatrix(float aspectRatio)
{
	XMStoreFloat4x4(&projection, XMMatrixPerspectiveFovLH(XMConvertToRadians(90), aspectRatio, .1f, 100));
}

// Update view matrix
void Camera::UpdateViewMatrix()
{
	XMStoreFloat4x4(&view, XMMatrixLookToLH(XMLoadFloat3(&cam->GetPosition()), XMLoadFloat3(&cam->GetForward()), XMVectorSet(0.0f, 1.0f, 0.0f, 0.0f)));
}

// Process input to move camera
void Camera::Update(float dt)
{
	// Get reference to input manager
	Input& input = Input::GetInstance();

	if (input.KeyDown('W')) 
	{ 
		// Move camera forward
		cam->MoveRelative(0,0, moveSpeed * dt);
	}
	if (input.KeyDown('S')) 
	{ 
		// Move camera backward
		cam->MoveRelative(0,0, -1 * moveSpeed * dt);
	}
	if (input.KeyDown('A'))
	{
		// Strafe camera left
		cam->MoveRelative(-1 * moveSpeed * dt, 0,0);
	}
	if (input.KeyDown('D'))
	{
		// Strafe camera right
		cam->MoveRelative(moveSpeed * dt, 0,0);
	}
	if (input.KeyDown(VK_SPACE))
	{
		// Move camera up
		cam->MoveAbsolute(0, moveSpeed * dt, 0);
	}
	if (input.KeyDown('X'))
	{
		// Move camera down
		cam->MoveAbsolute(0, -1 * moveSpeed * dt,0);
	}

	// Process mouse movement
	if (input.MouseRightDown())
	{
		int cursorMovementX = input.GetMouseXDelta();
		int cursorMovementY = input.GetMouseYDelta();
		/* Other mouse movement code here */

		// clamp X rotation
		if (cam->GetPitchYawRoll().x > .5f * XM_PI)
		{
			if (cursorMovementY > 0)
			{
				cursorMovementY = 0;
			}
		}
		if (cam->GetPitchYawRoll().x < -.5f * XM_PI)
		{
			if (cursorMovementY < 0)
			{
				cursorMovementY = 0;
			}
			
		}

		cam->Rotate(cursorMovementY * mouseSpeed, cursorMovementX * mouseSpeed, 0);
	}

	UpdateViewMatrix();
}
