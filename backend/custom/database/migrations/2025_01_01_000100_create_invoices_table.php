<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('series_id');
            $table->string('doc_type', 4);
            $table->unsignedBigInteger('number');
            $table->string('status', 20)->default('draft');
            $table->decimal('total_net', 18, 2);
            $table->decimal('total_tax', 18, 2);
            $table->decimal('total_gross', 18, 2);
            $table->json('payload')->nullable();
            $table->timestamps();
            $table->unique(['series_id', 'number']);
            $table->index(['company_id', 'doc_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
