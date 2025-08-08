<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LocationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $locationId = $this->route('location') ? $this->route('location')->id : null;
        $isUpdate = $this->isMethod('PUT') || $this->isMethod('PATCH');

        return [
            'code' => [
                $isUpdate ? 'sometimes' : 'required',
                'string',
                'max:50',
                'unique:locations,code' . ($locationId ? ',' . $locationId : '')
            ],
            'name' => [
                $isUpdate ? 'sometimes' : 'required',
                'string',
                'max:255'
            ],
            'image' => [
                'nullable',
                'string',
                'max:500'
            ],
        ];
    }
}
