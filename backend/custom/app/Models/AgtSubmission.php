<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AgtSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_id',
        'request',
        'response',
        'status',
    ];

    protected $casts = [
        'request' => 'array',
        'response' => 'array',
    ];

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }
}
