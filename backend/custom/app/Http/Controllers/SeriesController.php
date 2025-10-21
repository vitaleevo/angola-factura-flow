<?php

namespace App\Http\Controllers;

use App\Models\Series;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SeriesController extends Controller
{
    public function index()
    {
        return Series::query()->paginate();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id' => ['required', 'integer'],
            'code' => ['required', 'string', 'max:20'],
            'doc_type' => ['required', 'string', 'max:4'],
            'next_number' => ['nullable', 'integer', 'min:1'],
            'active' => ['boolean'],
        ]);

        $series = Series::create($validated);

        return response()->json($series, Response::HTTP_CREATED);
    }

    public function update(Request $request, Series $series)
    {
        $validated = $request->validate([
            'code' => ['sometimes', 'string', 'max:20'],
            'next_number' => ['sometimes', 'integer', 'min:1'],
            'active' => ['sometimes', 'boolean'],
        ]);

        $series->fill($validated);
        $series->save();

        return $series->refresh();
    }
}
