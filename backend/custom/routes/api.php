<?php

use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\SeriesController;
use Illuminate\Support\Facades\Route;

Route::get('/series', [SeriesController::class, 'index']);
Route::post('/series', [SeriesController::class, 'store'])->middleware('idempotency:series');
Route::patch('/series/{series}', [SeriesController::class, 'update']);

Route::post('/invoices/issue', [InvoiceController::class, 'store'])
    ->middleware('idempotency:emission');
