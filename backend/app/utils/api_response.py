from typing import Any, Dict, Optional
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder


def build_response(
    *,
    http_status: int,
    success: bool,
    message: str,
    data: Any = None,
    error: Optional[Dict[str, Any]] = None,
    meta: Optional[Dict[str, Any]] = None,
):
    body: Dict[str, Any] = {
        "success": success,
        "message": message,
    }
    if data is not None:
        body["data"] = data
    if meta is not None:
        body["meta"] = meta
    if error is not None:
        body["error"] = error
    encoded = jsonable_encoder(body)
    return JSONResponse(status_code=http_status, content=encoded)


def ok(data: Any = None, message: str = "Request successful.", meta: Optional[Dict[str, Any]] = None):
    return build_response(http_status=200, success=True, message=message, data=data, meta=meta)


def created(data: Any = None, message: str = "Resource created successfully."):
    return build_response(http_status=201, success=True, message=message, data=data)


def no_content():
    return JSONResponse(status_code=204, content=None)


def error_response(
    *,
    status: int,
    code: str,
    description: str,
    message: Optional[str] = None,
    suggestion: Optional[str] = None,
    fields: Optional[Dict[str, Any]] = None,
    trace_id: Optional[str] = None,
):
    error: Dict[str, Any] = {
        "code": code,
        "description": description,
    }
    if suggestion:
        error["suggestion"] = suggestion
    if fields:
        error["fields"] = fields
    if trace_id:
        error["traceId"] = trace_id
    return build_response(
        http_status=status,
        success=False,
        message=message or "An error occurred.",
        error=error,
    )


